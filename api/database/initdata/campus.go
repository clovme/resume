package initdata

import (
	"gorm.io/gorm"
	"resume/models"
)

// Campus 校园经历
func (d *InitData) Campus() bool {
	modelList := []models.Campus{
		{BaseModelWithRIDUID: ridUID()},
	}

	return insertRecord[models.Campus]("校园经历", modelList, func(model models.Campus) (db, where *gorm.DB) {
		return d.Db, d.Db.Where("rid = ? and uid = ? and name = ?", model.RID, model.UID, model.Name)
	})
}
