import { IBasicInfo } from './basicinfo.ts'
import { IMenus } from './menus.ts'
import { ISkills } from './skills.ts'
import { ITags } from './Tags.ts'
import { IWorksExperience } from './works.ts'
import { IProjectExperience } from './project.ts'
import { IEducation } from './education.ts'
import { IEvaluation } from './evaluation.ts'
import { IHonors } from './honors.ts'
import { IIntentions } from './intentions.ts'
import { IApplicationInfo, ICourseGrade } from './applicationinfo.ts'
import { ISlogan } from './slogan.ts'
import { ISetting } from './setting.ts'

// 定义状态类型
export interface State {
  menus: IMenus[] // 菜单
  basicInfo: IBasicInfo // 基础信息
  skills: ISkills // 技能特长
  honors: IHonors // 荣誉证书
  hobbies: IHonors // 兴趣爱好
  skillsTags: ITags[] // 技能特长标签
  honorsTags: ITags[] // 荣誉证书标签
  hobbiesTags: ITags[] // 兴趣爱好标签
  works: IWorksExperience[] // 工作经历
  internship: IWorksExperience[] // 实习经历
  campus: IWorksExperience[] // 校园经历
  project: IProjectExperience[] // 项目经验
  education: IEducation[] // 教育经历
  evaluation: IEvaluation // 自我评价
  intentions: IIntentions // 求职意向
  applicationInfo: IApplicationInfo // 报考专业
  courseGrade: ICourseGrade[] // 报考课程
  slogan: ISlogan // 简历标题
  setting: ISetting // 简历设置
}
