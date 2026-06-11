import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./components/scene/BilliardsScene', () => ({
  BilliardsScene: (props: {
    geometry: {
      cueBall: { x: number; z: number };
      objectPath: { x: number; z: number };
      cuePath: { x: number; z: number };
      cutAngleDegrees: number;
    };
    examAimTarget: { x: number; z: number };
    examMode: boolean;
  }) => {
    const userAimAngle = props.examMode
      ? angleBetween(props.geometry.objectPath, {
          x: props.examAimTarget.x - props.geometry.cueBall.x,
          z: props.examAimTarget.z - props.geometry.cueBall.z
        })
      : null;

    return (
      <div
        data-testid="mock-billiards-scene"
        data-cut-angle={props.geometry.cutAngleDegrees.toFixed(4)}
        data-user-aim-angle={userAimAngle?.toFixed(4) ?? ''}
      >
        Mock 3D scene
      </div>
    );
  }
}));

function angleBetween(a: { x: number; z: number }, b: { x: number; z: number }) {
  const bLength = Math.hypot(b.x, b.z) || 1;
  const dot = (a.x * b.x + a.z * b.z) / bLength;
  const clamped = Math.min(1, Math.max(-1, dot));

  return (Math.acos(clamped) * 180) / Math.PI;
}

describe('App', () => {
  it('shows Chinese teaching mode by default and switches to formula mode', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '台球瞄准' })).toBeInTheDocument();
    expect(screen.getByLabelText('击球线投影')).toBeInTheDocument();
    expect(screen.getByLabelText('1 - sin(a)')).toBeInTheDocument();
    expect(screen.getByText('1. 找到子球到目标袋口的进球线。')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '公式' }));

    expect(screen.getByText(/coverage = 1 - sin/)).toBeInTheDocument();
  });

  it('switches the interface language to English', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '切换语言' }));

    expect(screen.getByRole('heading', { name: 'Cueball Aiming' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Formula' })).toBeInTheDocument();
  });

  it('toggles helper options', () => {
    render(<App />);

    const ghostBallToggle = screen.getByRole('checkbox', { name: '幻想球' });
    const projectionToggle = screen.getByRole('checkbox', { name: '垂直直径投影' });
    const cueProjectionToggle = screen.getByRole('checkbox', { name: '击球线投影窗' });
    const postImpactToggle = screen.getByRole('checkbox', { name: '撞击后母球轨迹' });
    const cutAngleToggle = screen.getByRole('checkbox', { name: '角度 a' });

    expect(ghostBallToggle).toBeChecked();
    fireEvent.click(ghostBallToggle);
    expect(ghostBallToggle).not.toBeChecked();
    expect(projectionToggle).toBeChecked();
    expect(cueProjectionToggle).toBeChecked();
    expect(postImpactToggle).toBeChecked();
    expect(cutAngleToggle).toBeChecked();
  });

  it('changes the selected pocket', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('目标袋口'), {
      target: { value: 'middle-s' }
    });

    expect(screen.getAllByText('下中袋').length).toBeGreaterThanOrEqual(2);
  });

  it('toggles camera and ball locks and switches to the 2D top view', () => {
    render(<App />);

    const lockButton = screen.getByRole('button', { name: '锁定视角' });
    fireEvent.click(lockButton);
    expect(lockButton).toHaveAttribute('aria-pressed', 'true');

    const cueLockButton = screen.getByRole('button', { name: '锁定母球' });
    fireEvent.click(cueLockButton);
    expect(cueLockButton).toHaveAttribute('aria-pressed', 'true');

    const objectLockButton = screen.getByRole('button', { name: '锁定子球' });
    fireEvent.click(objectLockButton);
    expect(objectLockButton).toHaveAttribute('aria-pressed', 'true');

    const topViewButton = screen.getByRole('button', { name: '2D俯视' });
    fireEvent.click(topViewButton);
    expect(topViewButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('enters exam mode, hides theory metrics, and shows a result after confirmation', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '进入考试' }));

    expect(screen.getByRole('button', { name: '退出考试' })).toBeInTheDocument();
    expect(screen.queryByText('切角')).not.toBeInTheDocument();
    expect(screen.queryByText(/objectPath = normalize/)).not.toBeInTheDocument();
    expect(screen.getByLabelText('目标袋口')).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: '确定' }));

    expect(screen.getByText('考试结果')).toBeInTheDocument();
  });

  it('keeps generated exam shots and initial exam aim lines possible', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '高级' }));
    fireEvent.click(screen.getByRole('button', { name: '进入考试' }));

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const scene = screen.getByTestId('mock-billiards-scene');
      const cutAngle = Number(scene.getAttribute('data-cut-angle'));
      const userAimAngle = Number(scene.getAttribute('data-user-aim-angle'));

      expect(cutAngle).toBeLessThanOrEqual(90);
      expect(userAimAngle).toBeLessThanOrEqual(90);

      fireEvent.click(screen.getByRole('button', { name: '换一题' }));
    }
  });
});
