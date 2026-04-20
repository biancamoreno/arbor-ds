import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj;

function PaginationDemo({ totalPages = 10 }: { totalPages?: number }) {
  const [page, setPage] = useState(1);
  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button
            aria-label="Página anterior"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </Pagination.Button>
        </Pagination.Item>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Pagination.Item key={p}>
            <Pagination.Button
              isActive={p === page}
              onClick={() => setPage(p)}
              aria-label={`Página ${p}`}
            >
              {p}
            </Pagination.Button>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Button
            aria-label="Próxima página"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ›
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
}

export const Default: Story = {
  render: () => <PaginationDemo totalPages={5} />,
};

export const ManyPages: Story = {
  render: () => (
    <Pagination>
      <Pagination.List>
        <Pagination.Item><Pagination.Button aria-label="Anterior">‹</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Button aria-label="Página 1">1</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Button aria-label="Página 2">2</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Button aria-label="Página 3" isActive>3</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
        <Pagination.Item><Pagination.Button aria-label="Página 10">10</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Button aria-label="Próxima">›</Pagination.Button></Pagination.Item>
      </Pagination.List>
    </Pagination>
  ),
};
