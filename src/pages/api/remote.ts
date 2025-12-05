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
    
    const data = await response.json();
    
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

