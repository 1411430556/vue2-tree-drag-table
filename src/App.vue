<template>
  <div id="app">
    <h1>树形拖拽表格</h1>
    <div class="tips">
      <p>操作说明：</p>
      <ul>
        <li>一级表格只能在同级之间拖动排序（同一级表格之间）</li>
        <li>二级表格只能在二级表格之间拖动排序（可以跨一级分组）</li>
        <li>拖动二级表格时会自动带上该表格下的所有子数据</li>
      </ul>
    </div>
    <tree-table 
      :data.sync="treeData" 
      @level-one-reorder="handleLevelOneReorder"
      @level-two-reorder="handleLevelTwoReorder"
      @level-two-move-group="handleLevelTwoMoveGroup" />
  </div>
</template>

<script>
import TreeTable from './TreeTable.vue'
import listData from './list.json'

export default {
  name: 'App',
  components: {
    TreeTable
  },
  data() {
    return {
      treeData: []
    }
  },
  created() {
    // 加载数据
    this.treeData = listData
  },
  methods: {
    handleLevelOneReorder({ fromIndex, toIndex, item }) {
      console.log('一级表格重新排序:', { fromIndex, toIndex, item })
      // 在实际应用中，这里可以调用API将排序结果保存到后端
    },
    handleLevelTwoReorder({ fromIndex, toIndex, groupId, item }) {
      console.log('二级表格同组内重新排序:', { fromIndex, toIndex, groupId, item })
      // 在实际应用中，这里可以调用API将排序结果保存到后端
    },
    handleLevelTwoMoveGroup({ item, fromGroupId, toGroupId }) {
      console.log('二级表格跨组移动:', { item, fromGroupId, toGroupId })
      // 在实际应用中，这里可以调用API将跨组移动结果保存到后端
    },
    // 如果需要保存数据到后端，可以添加如下方法
    saveToBackend() {
      // 示例代码，实际使用时需替换为真实的API调用
      console.log('保存数据到后端:', JSON.stringify(this.treeData))
      // axios.post('/api/save-tree-data', this.treeData)
      //   .then(response => {
      //     console.log('保存成功', response)
      //   })
      //   .catch(error => {
      //     console.error('保存失败', error)
      //   })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.tips {
  background-color: #f8f8f8;
  border-left: 4px solid #409eff;
  padding: 10px 15px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.tips ul {
  margin: 5px 0;
  padding-left: 20px;
}

.tips li {
  margin-bottom: 5px;
}
</style> 