import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // 从请求体中获取目标服务器地址
    const { serverUrl, token, command } = body;
    
    if (!serverUrl || !token || !command) {
      return new Response(JSON.stringify({
        Code: 400,
        Msg: '缺少必要参数'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // 转发请求到目标服务器 (使用正确的路径 /api/command)
    const targetUrl = serverUrl.endsWith('/api/command') ? serverUrl : `${serverUrl}/api/command`;
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        command
      })
    });
    const raw = await response.text();

    const parseApi = (s: string): any => {
      let t = s;
      t = t.trim();
      try {
        const direct = JSON.parse(t);
        if (typeof direct === 'string') {
          return parseApi(direct);
        }
        return direct;
      } catch {}
      if (t.startsWith('"') && t.endsWith('"')) {
        try {
          const unquoted = t.slice(1, -1).replace(/\\"/g, '"');
          return JSON.parse(unquoted);
        } catch {}
      }
      const start = t.indexOf('{');
      const end = t.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        try {
          return JSON.parse(t.slice(start, end + 1));
        } catch {}
      }
      const codeMatch = t.match(/"Code"\s*:\s*(\d+)/);
      const msgMatch = t.match(/"Msg"\s*:\s*"([\s\S]*?)"/);
      if (codeMatch || msgMatch) {
        return { Code: codeMatch ? Number(codeMatch[1]) : (response.ok ? 200 : 500), Msg: msgMatch ? msgMatch[1] : '' };
      }
      return { Code: response.ok ? 200 : response.status || 500, Msg: 'Upstream response is not valid JSON' };
    };

    const data = parseApi(raw);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({
      Code: 500,
      Msg: '代理请求失败: ' + (error instanceof Error ? error.message : '未知错误')
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

