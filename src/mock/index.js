import Mock from 'mockjs'



// Mock.mock('/tableList', 'post', function() {
//     const data = Mock.mock({
//         'list|10': [
//             {
//                 'id|+1': 1,
//                 'name': '@name',
//                 'date': '@date',
//                 'city': '@region',
//                 'address': '@county(true)',
//                 'email': '@email',
//                 'zip': '@integer'
//             }
//         ]
//     })
//     return {
//         code: 200,
//         data: {
//             page: 1,
//             size: 20,
//             total: 50,
//             list: data.list
//         }
//     }
// })


Mock.mock('/mainInfo', 'post', function () {
    const data = {
        main: [
            { field: 'id', name: 'ID', type: 'text'},
            { field: 'name', name: '名称', type: 'text'},
            { field: 'date', name: '日期', type: 'date'},
            { field: 'city', name: '城市', type: 'select'},
            { field: 'address', name: '地址', type: 'textArea'},
            { field: 'email', name: '邮箱', type: 'text'},
            { field: 'zip', name: '邮编', type: 'number'},
            { field: 'order', name: '订单', child: true }
        ],
        item: {
            order: [
                { field: 'id', name: 'ID', type: 'text'},
                { field: 'docno', name: '订单编号', type: 'text'},
                { field: 'date', name: '日期', type: 'date'},
                { field: 'itemCode', name: '料品编号', type: 'text'},
                { field: 'itemName', name: '料品名称', type: 'text'},
                { field: 'price', name: '价格', type: 'number'}
            ]
        }
    }
    return {
        code: 200, data, msg: ''
    }
})