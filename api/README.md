# resume

个人简历API接口

go version go1.22.2 windows/amd64

在Windows平台上为Go程序添加图标可以按照以下步骤进行：

1. **准备图标文件**：确保你有一个图标文件，例如`icon.ico`。

2. **创建资源文件**：创建一个名为`resource.rc`的资源文件，内容如下：
    ```rc
    id ICON "icon.ico"
    ```

3. **安装MinGW工具链**：如果还没有安装MinGW，可以从[MinGW官网](http://www.mingw.org/)下载并安装。

4. **编译资源文件**：使用`windres`工具将资源文件编译为对象文件：
    ```sh
    windres resource.rc -O coff -o resource.syso
    ```

5. **编译Go程序并链接资源文件**：
   
   ```sh
   # 安装build工具
   go install github.com/clovme/build@latest
   
   # 执行build编译
   build
   ```
   

web页面 [https://github.com/clovme/resume-web.git](https://github.com/clovme/resume-web.git)