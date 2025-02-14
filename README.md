详细步骤说明
1. Fork 到自己的仓库
首先，您需要从原始项目中创建一个自己专属的副本。操作步骤如下：

访问原始项目的 GitHub 仓库页面。
点击右上角的 Fork 按钮，将该仓库 Fork 到您自己的 GitHub 账户中。
完成后，您会在您的 GitHub 账户下看到该仓库。
2. 选择 Cloudflare Pages 关联 GitHub，进行部署
接下来，您需要将 GitHub 仓库与 Cloudflare Pages 关联，并进行部署。步骤如下：

登录到您的 Cloudflare 帐号，进入 Cloudflare Pages 部分。
点击右上角的 Create a Project（创建项目）按钮。
在弹出的页面中，选择 GitHub 作为版本控制服务。
授权 Cloudflare 访问您的 GitHub 仓库，并选择您之前 Fork 的仓库。
按照指引完成配置并选择部署设置。此时，Cloudflare Pages 会自动读取您的仓库，进行构建和部署。
3. 设置变量 DOH_SERVERS
在 Cloudflare Pages 部署完成后，您需要设置 DOH_SERVERS 环境变量。步骤如下：

在 Cloudflare Pages 控制面板中，找到您的项目，点击进入项目的设置页面。
选择 Environment Variables（环境变量）部分。
创建一个新的环境变量，名称为 DOH_SERVERS，值为您自己的 DoH（DNS over HTTPS）服务器的地址。可以使用多个 DoH 服务器，用英文逗号隔开。例如：
https://doh.example1.com,https://doh.example2.com,https://doh.example3.com](https://dns.google/dns-query,https://cloudflare-dns.com/dns-query,https://dns.quad9.net/dns-query

这样设置之后，系统会自动轮询这些 DoH 服务器，并优先使用响应最快的服务器。
4. 使用 Pages 的域名或自定义域名 + /dns-query 路径
部署完成后，您可以使用 Cloudflare Pages 提供的默认域名或者您自己配置的自定义域名，来进行 DNS 查询。使用方法如下：

默认域名：https://your-cloudflare-pages-name.pages.dev/dns-query
自定义域名：假设您的自定义域名是 yourdomain.com，那么访问方式为 https://yourdomain.com/dns-query
您可以将 /dns-query 路径附加在域名后进行 DNS 查询。****
