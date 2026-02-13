import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from '@/context';
import { router } from '@/router';
import { queryClient } from '@/utils/queryClient';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
