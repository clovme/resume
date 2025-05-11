package project

import (
	"github.com/gin-gonic/gin"
	"resume/libs"
	"resume/models"
)

func Post(c *gin.Context) {
	s := libs.Context(c)

	project := models.Project{BaseModelWithRIDUID: models.BaseModelWithRIDUID{RID: s.Resume.ID, UID: s.User.ID}, Content: "<p><strong>使用技术：</strong></p><p><strong>项目描述：</strong></p><p><strong>责任描述：</strong></p><p><strong>技术描述：</strong></p>"}

	libs.Create[models.Project](s, "项目经验", &project, models.Project{}, "id = ? AND uid = ? AND rid = ?", project.ID, s.User.ID, s.Resume.ID)
}
