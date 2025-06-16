# 树形拖拽表格

一个基于Vue2和vuedraggable实现的树形拖拽表格组件，支持一级表格和二级表格的拖拽排序，以及二级表格的跨组拖拽。

## 功能特点

- 一级表格只能在同级之间拖动排序
- 二级表格可以在同级之间拖动排序
- 二级表格支持跨一级组拖动
- 拖动二级表格时会自动带上其下的所有子数据

## 项目结构

```
├── public/              # 静态资源目录
│   └── index.html       # HTML入口文件
├── src/                 # 源码目录
│   ├── App.vue          # 主应用组件
│   ├── TreeTable.vue    # 树形表格组件
│   ├── main.js          # 应用入口
│   └── list.json        # 测试数据
├── package.json         # 项目依赖配置
├── vue.config.js        # Vue项目配置
└── README.md            # 项目说明
```

## 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build
```

## 使用方法

```vue
<template>
  <tree-table 
    :data.sync="treeData" 
    @level-one-reorder="handleLevelOneReorder"
    @level-two-reorder="handleLevelTwoReorder"
    @level-two-move-group="handleLevelTwoMoveGroup" />
</template>

<script>
import TreeTable from './TreeTable.vue'

export default {
  components: {
    TreeTable
  },
  data() {
    return {
      treeData: [] // 树形数据
    }
  },
  methods: {
    handleLevelOneReorder({ fromIndex, toIndex, item }) {
      // 处理一级表格重排序
    },
    handleLevelTwoReorder({ fromIndex, toIndex, groupId, item }) {
      // 处理二级表格同组内重排序
    },
    handleLevelTwoMoveGroup({ item, fromGroupId, toGroupId }) {
      // 处理二级表格跨组移动
    }
  }
}
</script>
```

## 数据格式

组件接受的数据格式如下：

```javascript
[
  {
    "id": 1,
    "name": "一级分组1",
    "is_hidden": 0,
    "order": 0,
    "groups_items": [
      {
        "id": 1,
        "groups_id": 1,
        "name": "二级分组1",
        "is_hidden": 0,
        "order": 0,
        "product": [
          {
            "id": 1,
            "groups_items_id": 1,
            "name": "产品1",
            "type": "type1",
            "type_name": "类型1"
          }
        ]
      }
    ]
  }
]
``` 