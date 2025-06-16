<template>
  <div class="tree-table-container">
    <div class="tree-table">
      <div class="level-one-container">
        <!-- 一级表格（只能在同级内拖动） -->
        <draggable 
          v-model="localData" 
          group="level-one"
          @end="onLevelOneDragEnd"
          class="level-one-list"
          handle=".drag-handle-level-one">
          <div 
            v-for="(item, index) in localData" 
            :key="item.id"
            class="level-one-item">
            <div class="level-one-header">
              <i class="drag-handle-level-one">≡</i>
              <span>{{ item.name }}</span>
            </div>
            
            <!-- 二级表格（可以跨一级组拖动） -->
            <draggable 
              v-model="item.groups_items" 
              :group="{ name: 'level-two', pull: true, put: true }"
              @end="onLevelTwoDragEnd($event, item.id)"
              class="level-two-list"
              handle=".drag-handle-level-two">
              <div 
                v-for="subItem in item.groups_items" 
                :key="subItem.id"
                class="level-two-item">
                <div class="level-two-header">
                  <i class="drag-handle-level-two">≡</i>
                  <span>{{ subItem.name }}</span>
                </div>
                <!-- 子数据展示区域 -->
                <div class="product-list" v-if="subItem.product && subItem.product.length">
                  <div v-for="product in subItem.product" :key="product.id" class="product-item">
                    {{ product.name }} ({{ product.type_name }})
                  </div>
                </div>
              </div>
            </draggable>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'TreeTable',
  components: {
    draggable
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localData: [],
      isUpdating: false // 防止更新循环的标志
    }
  },
  created() {
    // 初始化时深拷贝数据
    this.localData = JSON.parse(JSON.stringify(this.data))
  },
  watch: {
    data: {
      handler(newVal) {
        // 避免循环更新
        if (!this.isUpdating) {
          this.localData = JSON.parse(JSON.stringify(newVal))
        }
      },
      deep: true
    }
  },
  methods: {
    onLevelOneDragEnd(evt) {
      if (evt.oldIndex === evt.newIndex) return
      
      // 一级表格拖动结束后更新order
      this.updateLevelOneOrder()
      
      // 标记正在更新
      this.isUpdating = true
      
      // 发送更新事件给父组件
      this.$emit('update:data', JSON.parse(JSON.stringify(this.localData)))
      this.$emit('level-one-reorder', {
        fromIndex: evt.oldIndex,
        toIndex: evt.newIndex,
        item: this.localData[evt.newIndex]
      })
      
      // 延迟重置标记，避免在同一事件循环中触发watch
      setTimeout(() => {
        this.isUpdating = false
      }, 0)
    },
    onLevelTwoDragEnd(evt, parentId) {
      // 二级表格拖动结束后，更新groups_id
      const { from, to, oldIndex, newIndex } = evt
      
      if (oldIndex === newIndex && from === to) return
      
      if (from !== to) {
        // 如果是跨组拖拽，需要更新groups_id
        const toGroupId = this.getGroupIdFromTo(to)
        if (toGroupId) {
          // 找到被拖动的项
          const draggedItem = this.findDraggedItem(evt)
          if (draggedItem) {
            // 更新groups_id为新组的id
            draggedItem.groups_id = toGroupId
            
            this.$emit('level-two-move-group', {
              item: draggedItem,
              fromGroupId: parentId,
              toGroupId: toGroupId
            })
          }
        }
      } else {
        // 同组内排序
        const draggedItem = this.findDraggedItem(evt)
        if (draggedItem) {
          this.$emit('level-two-reorder', {
            fromIndex: oldIndex,
            toIndex: newIndex,
            groupId: parentId,
            item: draggedItem
          })
        }
      }
      
      // 更新二级表格的order
      this.updateLevelTwoOrder()
      
      // 标记正在更新
      this.isUpdating = true
      
      // 发送更新事件给父组件
      this.$emit('update:data', JSON.parse(JSON.stringify(this.localData)))
      
      // 延迟重置标记，避免在同一事件循环中触发watch
      setTimeout(() => {
        this.isUpdating = false
      }, 0)
    },
    updateLevelOneOrder() {
      // 更新一级表格的order属性
      this.localData.forEach((item, index) => {
        item.order = index
      })
    },
    updateLevelTwoOrder() {
      // 更新所有二级表格的order属性
      this.localData.forEach(group => {
        group.groups_items.forEach((item, index) => {
          item.order = index
        })
      })
    },
    findDraggedItem(evt) {
      // 根据事件获取被拖动的元素
      if (evt.item && evt.item.__draggable_context && evt.item.__draggable_context.element) {
        return evt.item.__draggable_context.element
      }
      
      // 如果上面的方法获取不到，尝试从列表中获取
      if (evt.newIndex !== undefined && evt.to) {
        const parent = this.findParentFromTo(evt.to)
        if (parent && parent.groups_items && parent.groups_items[evt.newIndex]) {
          return parent.groups_items[evt.newIndex]
        }
      }
      
      return null
    },
    getGroupIdFromTo(to) {
      // 从目标元素获取父级group id
      const levelOneEl = this.findParentWithClass(to, 'level-one-item')
      if (levelOneEl) {
        const index = Array.from(levelOneEl.parentNode.children).indexOf(levelOneEl)
        if (this.localData[index]) {
          return this.localData[index].id
        }
      }
      return null
    },
    findParentFromTo(to) {
      // 从目标元素获取父级数据
      const levelOneEl = this.findParentWithClass(to, 'level-one-item')
      if (levelOneEl) {
        const index = Array.from(levelOneEl.parentNode.children).indexOf(levelOneEl)
        return this.localData[index]
      }
      return null
    },
    findParentWithClass(element, className) {
      let parent = element
      while (parent) {
        if (parent.classList && parent.classList.contains(className)) {
          return parent
        }
        parent = parent.parentNode
      }
      return null
    }
  }
}
</script>

<style scoped>
.tree-table-container {
  margin: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.level-one-list {
  width: 100%;
}

.level-one-item {
  margin-bottom: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f8f8f8;
}

.level-one-header {
  padding: 10px;
  font-weight: bold;
  background-color: #ecf5ff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
}

.level-two-list {
  padding: 5px;
  min-height: 30px;
}

.level-two-item {
  margin: 5px 0;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  background-color: #fff;
}

.level-two-header {
  padding: 8px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
}

.product-list {
  padding: 8px;
  background-color: #fafafa;
}

.product-item {
  padding: 4px 8px;
  margin: 2px 0;
  background-color: #f0f9eb;
  border-radius: 4px;
  font-size: 12px;
}

.drag-handle-level-one,
.drag-handle-level-two {
  cursor: move;
  margin-right: 8px;
  color: #909399;
}

/* 拖拽时的样式 */
.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.sortable-drag {
  opacity: 0.8;
  background: #daf5ff;
}
</style> 