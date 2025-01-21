import { visit } from 'unist-util-visit';
import { getBasePath } from './utils';

export function remarkImagePath() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      // If URL is relative or starts with /images, prepend the base path
      if (node.url.startsWith('/') || !node.url.startsWith('http')) {
        node.url = `${getBasePath()}${node.url.startsWith('/') ? '' : '/'}${node.url}`;
      }
    });
  };
}
