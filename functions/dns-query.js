// functions/dns-query.js
export async function onRequestPost({ request, env }) {
  try {
    // 1. 获取 DNS 查询请求数据
    const dnsQueryData = await request.arrayBuffer();

    // 2. 获取配置的 DoH 服务器列表 (从环境变量中获取，逗号分隔)
    const dohServerList = env.DOH_SERVERS ? env.DOH_SERVERS.split(',') : [];

    if (!dohServerList || dohServerList.length === 0) {
      return new Response("Error: No DoH servers configured.", { status: 500 });
    }

    // 3. 并发查询多个 DoH 服务器，并记录请求时间
    const queryPromises = dohServerList.map(async (dohServerUrl, index) => {
      const startTime = performance.now(); // 记录开始时间
      try {
        const response = await fetch(dohServerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/dns-message',
            'Accept': 'application/dns-message',
          },
          body: dnsQueryData,
        });

        if (!response.ok) {
          console.error(`DoH server ${dohServerUrl} error: ${response.status} ${response.statusText}`);
          return { error: `Server ${index + 1} error: ${response.status} ${response.statusText}`, time: performance.now() - startTime }; // 记录错误和时间
        }

        const responseData = await response.arrayBuffer();
        return { data: responseData, time: performance.now() - startTime, serverIndex: index }; // 记录响应数据、时间和服务器索引
      } catch (error) {
        console.error(`Error querying DoH server ${dohServerUrl}:`, error);
        return { error: `Server ${index + 1} query failed: ${error.message}`, time: performance.now() - startTime }; // 记录错误和时间
      }
    });

    // 4. 等待所有查询完成
    const queryResults = await Promise.all(queryPromises);

    // 5. 找出最快且成功的响应
    let fastestResponse = null;
    let minTime = Infinity;

    for (const result of queryResults) {
      if (result.data && result.time < minTime) {
        minTime = result.time;
        fastestResponse = result.data;
      }
    }

    // 6. 如果找到最快的成功响应，则返回给用户
    if (fastestResponse) {
      return new Response(fastestResponse, {
        headers: { 'Content-Type': 'application/dns-message' },
      });
    } else {
      // 7. 如果所有 DoH 服务器都失败，返回错误信息
      const errorMessages = queryResults.map(result => result.error).filter(Boolean).join('\n');
      return new Response(`All DoH servers failed.\nDetails:\n${errorMessages}`, { status: 502 }); // Bad Gateway
    }

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
