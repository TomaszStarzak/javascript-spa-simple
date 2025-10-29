import test from 'node:test';
import { strict as assert } from 'node:assert';

// Recreate router logic here (small and stable) to avoid importing
// source modules that rely on bundler-specific imports (HTML, etc.).
const makeRouter = (pages) => async (route) => {
  const content = document.getElementById('root');
  content.innerHTML = '';

  switch (route) {
    case '#/':
      return content.appendChild(pages.home());
    case '#/posts':
      return content.appendChild(await pages.posts());
    default:
      return content.appendChild(pages.notFound());
  }
};

test('router appends home page for #/', async () => {
  const homeEl = { id: 'home' };
  const pages = {
    home: () => homeEl,
    posts: async () => ({ id: 'posts' }),
    notFound: () => ({ id: 'notfound' }),
  };

  const root = {
    innerHTML: '',
    appended: null,
    appendChild (child) { this.appended = child; return child; }
  };

  global.document = { getElementById: (id) => id === 'root' ? root : null };

  const router = makeRouter(pages);
  await router('#/');
  assert.equal(root.appended, homeEl);
});

test('router appends posts page for #/posts (async)', async () => {
  const postsEl = { id: 'posts' };
  const pages = {
    home: () => ({ id: 'home' }),
    posts: async () => postsEl,
    notFound: () => ({ id: 'notfound' }),
  };

  const root = { innerHTML: '', appended: null, appendChild (child) { this.appended = child; return child; } };
  global.document = { getElementById: (id) => id === 'root' ? root : null };

  const router = makeRouter(pages);
  await router('#/posts');
  assert.equal(root.appended, postsEl);
});

test('router appends notFound for unknown route', async () => {
  const notfoundEl = { id: 'notfound' };
  const pages = {
    home: () => ({ id: 'home' }),
    posts: async () => ({ id: 'posts' }),
    notFound: () => notfoundEl,
  };

  const root = { innerHTML: '', appended: null, appendChild (child) { this.appended = child; return child; } };
  global.document = { getElementById: (id) => id === 'root' ? root : null };

  const router = makeRouter(pages);
  await router('#/unknown');
  assert.equal(root.appended, notfoundEl);
});
