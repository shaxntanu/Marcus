import { ChatContainer } from '@/components/ChatContainer';
import { FullscreenButton } from '@/components/FullscreenButton';
import { MobileWarning } from '@/components/MobileWarning';

export default function Home() {
  return (
    <main>
      <MobileWarning />
      <FullscreenButton />
      <ChatContainer />
    </main>
  );
}
