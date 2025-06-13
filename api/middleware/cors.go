package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// CorsMiddleware CORS 中间件
func CorsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 设置允许的来源，这里使用通配符允许所有来源访问，也可以指定具体的域名
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		// 设置允许的请求方法
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// 设置允许的请求头
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization, Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Browser-Type")

		// 允许请求携带凭证（如 Cookie、HTTP 认证信息等）
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		
		// 设置浏览器可以缓存预检请求响应的最长时间（秒）
		c.Writer.Header().Set("Access-Control-Max-Age", "3600")


		// 如果请求方法为 OPTIONS（预检请求）
		// 则返回 204 No Content 状态码，并终止后续的请求处理链
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		// 继续处理请求
		c.Next()
	}
}
