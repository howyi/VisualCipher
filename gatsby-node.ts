import * as path from 'path'

export const onCreateWebpackConfig = ({ actions }: any) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@/docs': path.resolve(__dirname, 'src/docs'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/lib/utils': path.resolve(__dirname, 'src/lib/utils'),
      },
    },
  })
}
