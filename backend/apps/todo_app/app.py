from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

todos = []

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    new_todo = {'id': len(todos) + 1, 'task': data['task'], 'completed': False}
    todos.append(new_todo)
    return jsonify(new_todo), 201

@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = next((t for t in todos if t['id'] == todo_id), None)
    if todo:
        data = request.get_json()
        if 'task' in data:
            todo['task'] = data['task']
        if 'completed' in data:
            todo['completed'] = data['completed']
        return jsonify(todo)
    return jsonify({'message': 'Todo not found'}, 404)

@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
   global todos
   todos=[t for t in todos if t['id'] != todo_id]
   return jsonify({'message' : 'Todo deleted'})

if __name__ == '__main__':
    app.run(debug=True)
