package initdata

import (
	"gorm.io/gorm"
	"resume/models"
)

// ProjectExperience 项目经验
func (d *InitData) ProjectExperience() bool {
	modelList := []models.Project{
		{BaseModelWithRIDUID: ridUID(), Content: "<p><strong>使用技术：</strong></p><p><strong>项目描述：</strong></p><p><strong>责任描述：</strong></p><p><strong>技术描述：</strong></p>"},
	}

	return insertRecord[models.Project]("项目经验", modelList, func(model models.Project) (db, where *gorm.DB) {
		return d.Db, d.Db.Where("rid = ? and uid = ? and name = ?", model.RID, model.UID, model.Name)
	})
}
