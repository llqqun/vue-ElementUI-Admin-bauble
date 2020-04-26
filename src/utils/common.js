import { Message, MessageBox } from 'element-ui';
import { deleteData } from '@/api/common';

export function delMessage(url) {
  return MessageBox.confirm('您确定要删除这条数据吗?', '警告', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning'
  })
    .then(async() => {
      return await deleteData(url).then(res => {
        Message.success('删除成功!');
        return res;
      }).catch(() => {
        return false;
      });
    });
}
