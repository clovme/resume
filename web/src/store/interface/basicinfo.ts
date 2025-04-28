// 基础信息(BasicInfo)表单
export interface IBasicInfo {
  id: string // ID
  name: string // 姓名
  isAge: boolean // 年龄
  birthday: string // 生日
  gender: string // 性别
  maritalStatus: string // 婚姻状况
  height: string // 身高
  weight: string // 体重
  ethnicGroup: string // 民族
  nativePlace: string // 籍贯
  politicalStatus: string // 政治面貌
  workExperienceYears: string // 工作年限
  desiredPosition: string // 求职岗位
  desiredCity: string // 意向城市
  desiredSalary: string // 期望薪资
  startDate: string // 入职时间
  phoneNumber: string // 电话
  emailAddress: string // 邮箱
  photo: string // 照片设置
  iShowPhoto: boolean // 展示照片
  customInfo: { [key: string]: string } // 自定义信息
}
