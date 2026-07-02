import { loadDemoBoard } from '@/lib/board';
import { BoardView } from '@/components/board/BoardView';

// Rendered per request (reads the live board); never statically prerendered.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { data, live } = await loadDemoBoard();
  return <BoardView initial={data} live={live} />;
}
