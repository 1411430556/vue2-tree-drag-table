<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <div class="theme-toggle">
      <label class="switch">
        <input type="checkbox" v-model="isDarkMode">
        <span class="slider round">
          <span class="icon sun">☀️</span>
          <span class="icon moon">🌙</span>
        </span>
      </label>
    </div>
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
      treeData: [],
      isDarkMode: false
    }
  },
  created() {
    // 加载数据
    this.treeData = listData
    
    // 从本地存储中读取主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      this.isDarkMode = true
      document.documentElement.classList.add('dark-mode')
      document.body.classList.add('dark-mode')
    }
  },
  watch: {
    isDarkMode(newVal) {
      // 保存主题设置到本地存储
      localStorage.setItem('theme', newVal ? 'dark' : 'light')
      
      // 添加或移除根元素的暗黑模式类
      if (newVal) {
        document.documentElement.classList.add('dark-mode')
        document.body.classList.add('dark-mode')
      } else {
        document.documentElement.classList.remove('dark-mode')
        document.body.classList.remove('dark-mode')
      }
    }
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
/* 亮色模式下的直接颜色定义 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  color: #2c3e50;
  transition: all 0.3s ease;
}

/* 暗色模式下的直接颜色定义 */
html.dark-mode, 
body.dark-mode {
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
}

/* 亮色主题变量 */
:root {
  --bg-color: #ffffff;
  --text-color: #2c3e50;
  --tips-bg: #f8f8f8;
  --tips-border: #409eff;
  --item-bg: #ffffff;
  --item-border: #ebeef5;
  --item-hover: #f5f7fa;
  --switch-bg: #e9e9eb;
  --switch-circle: #ffffff;
}

/* 暗色主题变量 */
.dark-mode {
  --bg-color: #1a1a1a;
  --text-color: #e0e0e0;
  --tips-bg: #2c3e50;
  --tips-border: #409eff;
  --item-bg: #2c3e50;
  --item-border: #4e5d6c;
  --item-hover: #3e4b59;
  --switch-bg: #409eff;
  --switch-circle: #ffffff;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--bg-color);
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  transition: all 0.3s ease;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.theme-toggle {
  text-align: right;
  margin-bottom: 20px;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--switch-bg);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  overflow: hidden;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: var(--switch-circle);
  transition: all 0.3s ease;
  z-index: 2;
}

input:checked + .slider {
  background-color: var(--tips-border);
}

input:checked + .slider:before {
  transform: translateX(30px);
}

.slider.round {
  border-radius: 30px;
}

.slider.round:before {
  border-radius: 50%;
}

.icon {
  font-size: 12px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.icon.sun {
  margin-left: 2px;
}

.icon.moon {
  margin-right: 2px;
}

.tips {
  background-color: var(--tips-bg);
  border-left: 4px solid var(--tips-border);
  padding: 10px 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tips ul {
  margin: 5px 0;
  padding-left: 20px;
}

.tips li {
  margin-bottom: 5px;
}

/* 全局过渡效果 */
*, *::before, *::after {
  transition: all 0.3s ease;
}
</style> 