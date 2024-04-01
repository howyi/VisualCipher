import * as path from 'path'

export const onCreateWebpackConfig = ({ actions }: any) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@/react-pwa-install': path.resolve(__dirname, 'src/react-pwa-install'),
        '@/docs': path.resolve(__dirname, 'src/docs'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/lib': path.resolve(__dirname, 'src/lib'),
      },
    },
  })
}
