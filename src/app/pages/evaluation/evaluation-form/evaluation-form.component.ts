import { Component, OnInit } from '@angular/core';

//add esses imports
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute, Router } from "@angular/router";
import { EvaluationService } from "../evaluation.service";
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss']
})

export class EvaluationFormComponent implements OnInit{
  // implementar essa classe toda aqui
  evaluation: any = {};

  userLabel: Array<{value: String, label: String}> = []; 
  courseLabel: Array<{value: String, label: String}> = [];

  form = new FormGroup({});
  model: any = {};
  //Cria os campos e atribui os valores para serem gerados pelo angular

  fields: FormlyFieldConfig[] = [
    {
      className: 'd-flex align-content-center justify-content-center',
      fieldGroupClassName: 'row',
      fieldGroup: [
        //Depois com a integração com o backend vamos buscar os nomes dos cursos e usuarios disponíveis para transformar isso num campo de eescolha
        {
          key: 'user_id',
          type: 'select',
          props: {
            label: 'Id do Usuario',
            required: true,
            options: this.sharedService.getUsers(),
          },
        },
        {
          key: 'course_id',
          type: 'select',
          props: {
            label: 'Id do Curso',
            required: true,
            options: this.sharedService.getCourses(),
          },
        },
        {
          key: 'concept',
          type: 'input',
          props: {
            label: 'Conceito',
            placeholder: 'Conceito da Avaliação',
            required: true,
          },
        }
      ]
    }
  ];

  async ngOnInit(): Promise<void> {
  }

  //Daqui pra baixo já é a parte de integração frontend/backend
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService,
    private sharedService: SharedService
  ) {

    this.route.queryParams.subscribe(async (params: any) => {
      if (params.id !== undefined && params.id !== null) {
        //Esse método vai conectar com o backend
        this.evaluation = await this.evaluationService.get<any>({
          url: `http://localhost:3000/evaluation/${params.id}`,
          params: {
          }
        });
        this.model = this.evaluation;
      } else {
        this.model = {}
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      if (this.model?.id !== undefined && this.model?.id !== null) {
        this.evaluation = await this.evaluationService.put<any>({
          //Esse método vai enviar os dados 
          url: `http://localhost:3000/updateEvaluation/${this.model?.id}`,
          params: {
          },
          data: this.model
        });
      } else {
        delete this.model?.id;
        await this.evaluationService.post<any>({
          url: `http://localhost:3000/addEvaluation`,
          params: {
          },
          data: this.model
        });
      }
    }
    await this.router.navigate(['/evaluations']);
  }
}
