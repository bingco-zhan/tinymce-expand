(function () {

    'use strict'
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')
    const $promise = tinymce.util.Tools.resolve('tinymce.util.Promise')
    const DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');
    let $ = undefined, empty = ''


    const templates = [
        {
            title: '明细表格',
            description: '【明细表格】模板',
            content: '<table data-mce-class="mce-item-table" style="border-collapse: collapse; width: 100%;" border="1"> \
                <caption style="text-align: right"><button class="mce-button">添加</button> <button class="mce-button">删除</button></caption> \
                <tbody> \
                <tr> \
                <th style="width: 23.6263%; background-color: #c4f2f7;">&nbsp;</th> \
                <th style="width: 23.7192%; background-color: #c4f2f7;">&nbsp;</th> \
                <th style="width: 23.7192%; background-color: #c4f2f7;">&nbsp;</th> \
                <th style="width: 23.7192%; background-color: #c4f2f7;">&nbsp;</th> \
                </tr> \
                <tr> \
                <td style="width: 23.6263%;">&nbsp;</td> \
                <td style="width: 23.7192%;">&nbsp;</td> \
                <td style="width: 23.7192%;">&nbsp;</td> \
                <td style="width: 23.7192%;">&nbsp;</td> \
                </tr> \
                </tbody> \
                </table>'
        }, {
            title: '模板流程①',
            description: '【主体+明细表格】模板',
            content: '<h1 style="text-align: center;"><span style="color: #34495e;">模板流程</span></h1> \
                <br /> \
                <table style="border-collapse: collapse; width: 776px; margin-left: auto; margin-right: auto; height: 46px;" border="1"> \
                <tbody> \
                <tr style="height: 23px;"> \
                <td style="width: 55px; height: 23px; text-align: center; background-color: #c4f2f7;">&nbsp;</td> \
                <td style="width: 132px; height: 23px;">&nbsp;</td> \
                <td style="width: 57px; height: 23px; text-align: center; background-color: #c4f2f7;">&nbsp;</td> \
                <td style="width: 146px; height: 23px;">&nbsp;</td> \
                <td style="width: 62px; height: 23px; background-color: #c4f2f7; text-align: center;">&nbsp;</td> \
                <td style="width: 262px; height: 23px;">&nbsp;</td> \
                </tr> \
                <tr style="height: 23px;"> \
                <td style="width: 55px; height: 23px; text-align: center; background-color: #c4f2f7;">&nbsp;</td> \
                <td style="width: 132px; height: 23px;">&nbsp;</td> \
                <td style="width: 57px; height: 23px; text-align: center; background-color: #c4f2f7;">&nbsp;</td> \
                <td style="height: 23px;" colspan="3">&nbsp;</td> \
                </tr> \
                <tr> \
                <td style="width: 55px;" colspan="6"> \
                <table style="border-collapse: collapse; width: 100%;" border="1" data-mce-class="mce-item-table"><caption style="text-align: right;"><button class="mce-button">添加</button> <button class="mce-button">删除</button></caption> \
                <tbody> \
                <tr> \
                <th style="width: 23.6263%; background-color: #c4f2f7;">&nbsp;</th> \
                <th style="width: 23.7192%; background-color: #c4f2f7;">&nbsp;</th> \
                <th style="width: 23.7192%; background-color: #c4f2f7;">&nbsp;</th> \
                <th style="width: 23.7192%; background-color: #c4f2f7;">&nbsp;</th> \
                </tr> \
                <tr> \
                <td style="width: 23.6263%;">&nbsp;</td> \
                <td style="width: 23.7192%;">&nbsp;</td> \
                <td style="width: 23.7192%;">&nbsp;</td> \
                <td style="width: 23.7192%;">&nbsp;</td> \
                </tr> \
                </tbody> \
                </table> \
                </td> \
                </tr> \
                </tbody> \
                </table>'
        }
    ]


    const Fn = () => {}
    const FnIf = (flag, fn1 = Fn, fn2 = Fn) => flag ? fn1() : fn2()
    const IsEmpty = (string) => { return !(!!string && string.trim().length > 0) }


    function uuid() {
        const s = [];
        const hexDigits = "0123456789ABCDEF";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = "4"
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
        s[8] = s[13] = s[18] = s[23] = ""
        return s.join("").substr(0, 8).toLowerCase()
    }

    /** 模态框体 */
    const makeBody = function() {
        return {
            type: 'panel',
            items: [
                {
                    type: 'grid',
                    columns: 2,
                    items: [
                        { type: 'input', name: 'name', label: 'name', disabled: true },
                        { type: 'input', name: 'field', label: 'field', disabled: true },
                        { type: 'input', name: 'width', label: 'width' },
                        { type: 'checkbox', name: 'readonly', label: 'Read only' }
                    ]
                }
            ]
        }
    }

    /** 模态框按钮 */
    const makeButton = function () {
        return [
            { type: 'cancel', name: 'cancel', text: 'cancel' },
            { type: 'submit', name: 'save', text: 'save', primary: true }
        ]
    }

    /** 模态框提交事件 */
    const submit = function (editor) {
        return function(api) {
            editor.execCommand('mceUpdateField', false, api.getData())
            api.close()
        }
    }


    /** 构建模态框 */
    function makeDialog(helper) {
        return new $promise((resolve) => {
            const input = $('.mce-field_selected')[0]
            const cache = JSON.parse(input.getAttribute('data-mce-cache') || '{}')
            resolve({
                ...helper.content,
                initialData: {...helper.data, ...cache}
            })
        })
    }

    function dialog(editor) {
        const helper = {
            content: {
                title: 'Insert/edit field',
                size: 'normal',
                type: 'panel',
                body: makeBody(),
                buttons: makeButton(),
                onSubmit: submit(editor)
            }
        }
        return {
            open(data = {}) {
                helper.data = data
                makeDialog(helper).then(editor.windowManager.open)
            }
        }
    }

    function validator(editor, data) {
        const parentDOMs = DOMUtils.DOM.getParents(editor.selection.getNode())
        const table = parentDOMs.filter(d => d.nodeName.match(/table/i))[0]
        if (!isInnerTable(table)) {
            if (data.ischild) {
                editor.windowManager.alert('非明细表格不能添加明细字段,请在模板中选择!!')
                return false
            }
        } else {
            if (!data.ischild) {
                editor.windowManager.alert('明细表格中不能添加主表字段!!')
                return
            }
            const th = parentDOMs.filter(d => d.nodeName.match(/th/i))[0]
            if (th) {
                editor.windowManager.alert('明细表格中表头不能添加字段!!')
                return false
            }

            editor.dom.setAttrib(table, 'data-mce-field', data['mainField'].field)
        }
        return true
    }

    /** 更新node */
    function insertOrUpdateField(editor, data) {
        if (!validator(editor, data)) {
            return
        }
        const selected = $('.mce-field_selected')
        data.width = data.width || '130px'
        let mainField = '', field
        const cache = JSON.parse(selected[0] ? selected[0].getAttribute('data-mce-cache') : '{}')
        data = {...data, ...cache}
        function genAlt(data) {
            if (data.mainField) {
                mainField = `${data.mainField.name} / `
            }
            field = `${data.name} ${data.readonly ? '[只读]' : empty}`
            return mainField + field
        }
        const name = data.field,
            args = {
                name,
                id: `field_${uuid()}`,
                alt: genAlt(data),
                class: 'mce-field',
                readonly: empty,
                value: `${data.name} ${data.readonly ? '[只读]' : empty}`,
                'data-mce-cache': JSON.stringify(data),
                style: `width: ${data.width}; height: 18px`
            }

        const input = editor.dom.createHTML('input', args)
        FnIf(selected.length > 0, () => {
            editor.selection.select(selected[0])
            editor.execCommand('mceReplaceContent', false, input)
        }, () => {
            editor.execCommand('mceInsertContent', false, input)
        })
    }

    /** 选中节点 */
    function selected(node) {
        FnIf(node, () => {
            node.classList.add('mce-field_selected')
        })
    }

    /** 删除所有选中节点 */
    function unselectAll(editor) {
        editor.dom.select('.mce-field_selected')
            .forEach(item => {
                item.classList.remove('mce-field_selected')
            })
    }

    /** 是否是字段元素 */
    function isField(el) {
        return el && el.classList.contains('mce-field')
    }

    /** 是否是明细内部表格 */
    function isInnerTable(el) {
        return el && el.nodeName.toLowerCase() === "table" && el.getAttribute('data-mce-class') === 'mce-item-table'
    }


    function setup(editor, baseUrl) {
        editor.contentCSS.push(baseUrl + '/style.css')
        editor.addCommand('mceField', function (ui, data) {
            dialog(editor).open(data) })
        editor.addCommand('mceUpdateField', function (ui, data) {
            editor.undoManager.transact(function () {
                return insertOrUpdateField(editor, data)
            })
        })
    }


    function register(editor) {
        $ = (function (selector, document = editor.contentDocument) {return tinymce.dom.DomQuery(selector, document)})

        // 注册头部按钮
        editor.ui.registry.addToggleButton('field', {
            icon: 'image',
            tooltip: 'Insert/edit field',
            onAction: dialog(editor).open
        })

        // 输入框单击
        editor.on('click', function (e) {
            unselectAll(editor)
            selected(isField(e.target) ? e.target : undefined)
        })

        // 输入框双击
        editor.on('dblclick', function (e) {
            if(isField(e.target)) {
                selected(e.target)
                editor.execCommand('mceField')
            }
        })

        editor.on('mouseover', function (e) {
            if(isField(e.target) && !IsEmpty(e.target.alt)) {
                const span = document.createElement('span')
                span.innerText = e.target.alt
                span.id = 'alt'
                span.style.position = 'absolute'
                span.style.top = (e.clientY + 78) + 'px'
                span.style.left = e.clientX + 'px'
                span.style.border = '1px solid'
                span.style.fontSize = '10px'
                span.style.padding = '2px 4px'
                span.style.position = 'absolute'
                span.style.backgroundColor = 'white'
                span.style.zIndex = '100'
                editor.editorContainer.appendChild(span)
            }
        })

        console.log(editor)

        editor.on('mouseout', function (e) {
            if(isField(e.target)) {
                $('#alt', editor.editorContainer).remove()
            }
        })

        // 删除键
        editor.on('keyup', function (e) {
            if ((e.keyCode === 8 || e.keyCode === 46) && isField(e.target)) {
                $('.mce-field_selected').remove()
                return
            }
            const node = editor.selection.getNode()
            if (e.keyCode === 8 && node.classList.contains('mce-button')) {
                if (node.innerText.length === 1) {
                    node.innerHTML = '&#65279;' + node.innerText
                    editor.selection.setCursorLocation(node, 1)
                }
            }
        })

        editor.on('load', function (e) {
            cutpoint(editor)
        })
    }


    function cutpoint(editor) {
        if (editor.hasPlugin('preview')) {
            const mcepreview = editor.editorCommands.commands.exec.mcepreview
            editor.editorCommands.commands.exec.mcepreview = function (command, ui, value, args) {
                unselectAll(editor)
                return mcepreview(command, ui, value, args)
            }
        }


        // 拓展table插件
        if (editor.hasPlugin('table')) {
            const { contextToolbars, menuItems } = editor.ui.registry.getAll()

            /**
             * start | 点击表格显示上下文菜单增强与控制
             */
            editor.ui.registry.addContextToolbar('innerTable', {
                predicate: function (table) {
                    return editor.dom.is(table, 'table') && editor.getBody().contains(table)
                        && isInnerTable(table)
                },
                items: 'tableprops tabledelete|tableinsertcolbefore tableinsertcolafter tabledeletecol',
                position: 'node',
                scope: 'node',
                type: 'contexttoolbar'
            })
            // 禁用表格原始上下文菜单
            const predicate = contextToolbars.table.predicate
            contextToolbars.table.predicate = function (table) {
                return predicate(table) && !isInnerTable(table)
            }
            /* end */


            /**
             * start | 右键点击表格显示上下文增强与控制
             */
            const onSetup$1 = menuItems.tabledeleterow.onSetup
            const onSetup$2 = menuItems.tableinsertrowbefore.onSetup
            const onSetup$3 = menuItems.tableinsertrowafter.onSetup
            const onSetup$4 = menuItems.tablecutrow.onSetup
            function over(api, fn) {
                const table = $('table[data-mce-selected=1]')[0]
                if (table && table.getAttribute('data-mce-class') === 'mce-item-table') {
                    api.setDisabled(true)
                } else {
                    fn(api)
                }
            }
            menuItems.tabledeleterow.onSetup = (api) => over(api, onSetup$1)
            menuItems.tableinsertrowbefore.onSetup = (api) => over(api, onSetup$2)
            menuItems.tableinsertrowafter.onSetup = (api) => over(api, onSetup$3)
            menuItems.tablecutrow.onSetup = (api) => over(api, onSetup$4)
            /* end */
        }

        // 拓展模板插件
        if (editor.hasPlugin('template')) {
            let templa = editor.getParam('templates')
            if (templa) {
                templates.forEach(item => templa.push(item))
            }
        }
    }





    function Plugin () {
        global.add('field', function (editor, baseUrl) {
            setup(editor, baseUrl)
            register(editor)
        })
    }

    Plugin();
}())