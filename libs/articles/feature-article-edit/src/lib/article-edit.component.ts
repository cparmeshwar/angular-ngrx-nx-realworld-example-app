import { DynamicFormComponent, Field, formsActions, ListErrorsComponent, ngrxFormsQuery } from '@realworld/core/forms';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, untracked } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ArticleStore } from '@realworld/articles/data-access';

const structure: Field[] = [
  {
    type: 'INPUT',
    name: 'title',
    placeholder: 'Article Title',
    validator: [Validators.required],
  },
  {
    type: 'INPUT',
    name: 'description',
    placeholder: "What's this article about?",
    validator: [Validators.required],
  },
  {
    type: 'TEXTAREA',
    name: 'body',
    placeholder: 'Write your article (in markdown)',
    validator: [Validators.required],
  },
  {
    type: 'INPUT',
    name: 'tagList',
    placeholder: 'Enter Tags',
    validator: [],
  },
];

@Component({
  selector: 'cdt-article-edit',
  standalone: true,
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  imports: [DynamicFormComponent, ListErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly articleStore = inject(ArticleStore);

  structure$ = this.store.select(ngrxFormsQuery.selectStructure);
  data$ = this.store.select(ngrxFormsQuery.selectData);

  readonly setArticleDataToForm = effect(() => {
    const articleLoaded = this.articleStore.getArticleLoaded();
    if (articleLoaded) {
      untracked(() => this.store.dispatch(formsActions.setData({ data: this.articleStore.data() })));
    }
  });

  ngOnInit() {
    this.store.dispatch(formsActions.setStructure({ structure }));
  }

  updateForm(changes: any) {
    this.store.dispatch(formsActions.updateData({ data: changes }));
  }

  submit() {
    this.articleStore.publishArticle();
  }

  ngOnDestroy() {
    this.store.dispatch(formsActions.initializeForm());
  }
}
