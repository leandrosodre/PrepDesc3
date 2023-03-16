import { Component } from '@angular/core';

//add esses imports
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TeacherService} from "../teacher.service";
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent {
  // implementar essa classe toda aqui
  teacher: any = {};
  form = new FormGroup({});
  model: any = {};
  //Cria os campos e atribui os valores para serem gerados pelo angular

  fields: FormlyFieldConfig[] = [
    {
      className: 'd-flex align-content-center justify-content-center',
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          props: {
            label: 'Nome',
            placeholder: 'Nome do Professor',
            required: true,
          },
        },
        //Depois com a integração com o backend vamos buscar os nomes dos cursos disponíveis para transformar isso num campo de eescolha
        {
          key: 'course_id',
          type: 'select',
          props: {
            label: 'Id do Curso',
            required: true,
            options: this.sharedService.getCourses(),
          },          
        }
      ]
    }
  ];

  //Daqui pra baixo já é a parte de integração frontend/backend
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private sharedService: SharedService
  ) {

    this.route.queryParams.subscribe(async (params: any) => {
      if (params.id !== undefined && params.id !== null) {
        //Esse método vai conectar com o backend
        this.teacher = await this.teacherService.get<any>({
          url: `http://localhost:3000/teacher/${params.id}`,
          params: {
          }
        });
        this.model = this.teacher;
      } else {
        this.model = {}
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      if (this.model?.id !== undefined && this.model?.id !== null) {
        this.teacher = await this.teacherService.put<any>({
          //Esse método vai enviar os dados 
          url: `http://localhost:3000/updateTeacher/${this.model?.id}`,
          params: {
          },
          data: this.model
        });
      } else {
        delete this.model?.id;
        await this.teacherService.post<any>({
          url: `http://localhost:3000/addTeacher`,
          params: {
          },
          data: this.model
        });
      }
    }
    await this.router.navigate(['/teachers']);
  }
}
