import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">소개 페이지입니다</h1>
      <Button variant="ghost" render={<Link to="/" />}>
        홈으로
      </Button>
    </div>
  );
}
