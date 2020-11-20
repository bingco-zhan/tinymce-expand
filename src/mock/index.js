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
            { field: 'id', name: 'ID'},
            { field: 'name', name: '名称'},
            { field: 'date', name: '日期'},
            { field: 'city', name: '城市'},
            { field: 'address', name: '地址'},
            { field: 'email', name: '邮箱'},
            { field: 'zip', name: '邮编'},
            { field: 'order', name: '订单', child: true }
        ],
        item: {
            order: [
                { field: 'id', name: 'ID'},
                { field: 'docno', name: '订单编号'},
                { field: 'date', name: '日期'},
                { field: 'itemCode', name: '料品编号'},
                { field: 'itemName', name: '料品名称'},
                { field: 'price', name: '价格'}
            ]
        }
    }
    return {
        code: 200, data, msg: ''
    }
})