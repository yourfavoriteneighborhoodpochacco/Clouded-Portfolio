import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let animFrame: number;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');
      setHovered(!!isClickable);
    };

    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);

    const lerp = () => {
      setTrailPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.12,
        y: prev.y + (pos.y - prev.y) * 0.12,
      }));
      animFrame = requestAnimationFrame(lerp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    animFrame = requestAnimationFrame(lerp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(animFrame);
    };
  }, [pos.x, pos.y]);

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed z-[99999] pointer-events-none rounded-full"
        style={{
          width: clicked ? '6px' : '8px',
          height: clicked ? '6px' : '8px',
          background: '#1A1410',
          transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
          transition: 'width 0.15s, height 0.15s, background 0.15s',
        }}
      />
      {/* Trailing ring */}
      <div
        className="fixed z-[99998] pointer-events-none rounded-full border"
        style={{
          width: hovered ? '36px' : '24px',
          height: hovered ? '36px' : '24px',
          borderColor: hovered ? '#C4622D' : 'rgba(26,20,16,0.3)',
          transform: `translate(${trailPos.x - (hovered ? 18 : 12)}px, ${trailPos.y - (hovered ? 18 : 12)}px)`,
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease',
        }}
      />
    </>
  );
};
