import Vue from 'vue'

// ローカルストレージ
const STORAGE_KEY = 'todo_vue'
let todoStorage = {
  fetch: function () {
    let todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

Vue.component('list-item', {
  props: ['todo'],
  template: `
    <li :class="[todo.isDone ? 'list__item list__item--done' : 'list__item']">
    <i :class="[todo.isDone ? 'fa fa-check-circle icon-check' : 'fa fa-circle-thin icon-check']" @click="$emit('toggle')" aria-hidden="true" />
    <input v-if="todo.editMode" v-model="todo.editText" type="text" class="editText" value="todo.text" @keyup.shift.enter="$emit('editdone')">
    <span v-if="!todo.editMode" @dblclick="$emit('edit')">{{ todo.text }}</span>
    <i class="fa fa-trash icon-trash" @click="$emit('delete')" aria-hidden="true" />
    </li>
  `
})

new Vue({
  el: '#app',
  data: {
    todos: [],
    newTodo: '',
    hasError: false,
    searchText: ''
  },
  watch: {
    todos: {
      handler: function(todos){
        todoStorage.save(todos)
      },
      deep: true
    }
  },
  created(){
    this.todos = todoStorage.fetch()
  },
  computed: {
    filteredTodos(){
      let todos = []
      for (const i in this.todos) {
        const todo = this.todos[i]
        if (todo.text.indexOf(this.searchText) !== -1) {
          todos.push(todo)
        }
      }
      return todos
    }
  },
  methods: {
    addTodo(){
      let text = this.newTodo
      if (!text) {
        this.hasError = true
        return
      }
      this.hasError = false
      this.todos.push({
        id: todoStorage.uid++,
        text: text,
        isDone: false,
        editMode: false,
        editText:''
      })
      this.newTodo = ''
    },
    toggleDone(todo){
      todo.isDone = !todo.isDone
    },
    removeTodo(todo){
      this.todos.splice(this.todos.indexOf(todo), 1)
    },
    editTodo(todo){
      todo.editMode = true
      todo.editText = todo.text
    },
    editDone(todo){
      const newText = todo.editText
      if (newText) {
        todo.text = newText
      }
      todo.editMode = false
    }
  }
})
