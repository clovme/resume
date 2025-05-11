package initdata

import (
	"gorm.io/gorm"
	"resume/models"
)

// WorkExperience 工作经历
func (d *InitData) WorkExperience() bool {
	modelList := []models.Works{
		{BaseModelWithRIDUID: ridUID(), StartAt: "2019-08", EndAt: "2021-03", Name: "XXX科技有限公司", Title: "UI设计师", Content: "<ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>负责协同后端API接口开发</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>负责和领导吹牛</li></ol>", ToNow: false, Sort: 0},
	}

	return insertRecord[models.Works]("技能特长", modelList, func(model models.Works) (db, where *gorm.DB) {
		return d.Db, d.Db.Where("rid = ? and uid = ? and name = ?", model.RID, model.UID, model.Name)
	})
}
