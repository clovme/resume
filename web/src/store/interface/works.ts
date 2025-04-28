// 工作经历
export interface IWorksExperience {
  id: string // 工作经历ID
  startAt: string // 开始时间
  endAt: string // 结束时间
  name: string // 公司名称
  title: string // 职位名称
  content: string // 工作内容
  sort: number // 排序
  toNow: boolean // 至今
}
