import { TodoSignalsService } from './../../services/todo-signals.service';
import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoKeyLocalStorage } from '../../models/enum/todoKeyLocalStorage';
import { Todo } from '../../models/model/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: []
})
export class TodoCardComponent implements OnInit {
  private todoSignalsService = inject(TodoSignalsService);
  private todosSignal = this.todoSignalsService.todosState;
  public todosList = computed(() => this.todosSignal());

  ngOnInit(): void {
      this.getTodosInLocalStorage();
  }

  private getTodosInLocalStorage(): void {
    const todosDatas = localStorage.getItem(TodoKeyLocalStorage.TODO_LIST) as string;
    todosDatas && this.todosSignal.set(JSON.parse(todosDatas));
  }

  private saveTodosInLocalStorage(): void {
    this.todoSignalsService.saveTodosInLocalStorage();
  }

 public handleDoneTodo(todoId: number): void {
  if (todoId) {
    this.todosSignal.update((todos) =>
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, done: true } : todo
      )
    );
    this.saveTodosInLocalStorage();
  }
}

public handleDeleteTodo(todo: Todo): void {
  if (todo) {
    this.todosSignal.update((todos) => {
      const filtered = todos.filter(t => t !== todo);
      this.saveTodosInLocalStorage();
      return filtered;
    });
  }
}


}
