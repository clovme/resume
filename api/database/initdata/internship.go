package initdata

import (
	"gorm.io/gorm"
	"resume/models"
)

// Internship 实习经历
func (d *InitData) Internship() bool {
	modelList := []models.Internship{
		{BaseModelWithRIDUID: ridUID()},
	}

	return insertRecord[models.Internship]("实习经历", modelList, func(model models.Internship) (db, where *gorm.DB) {
		return d.Db, d.Db.Where("rid = ? and uid = ?", model.RID, model.UID)
	})
}
