// 荣誉证书
export interface IHonors {
  id: string // ID
  content: string // html内容
  checkedTags: { [key: string]: boolean } // 选中的标签
}
