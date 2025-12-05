import { splitProps, type JSX } from 'solid-js';

interface SliderProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  min?: number;
  max?: number;
  value?: number;
}

export function Slider(props: SliderProps) {
  const [local, others] = splitProps(props, ['label', 'class', 'min', 'max', 'value']);
  
  const progress = () => {
    const min = local.min ?? 0;
    const max = local.max ?? 100;
    const val = local.value ?? min;
    return ((val - min) / (max - min)) * 100;
  };

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
      {local.label && (
        <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">
          {local.label}
        </label>
      )}
      <input
        type="range"
        min={local.min}
        max={local.max}
        value={local.value}
        class={`slider-custom ${local.class || ''}`}
        style={`--slider-progress: ${progress()}%`}
        {...others}
      />
      <style>{`
        .slider-custom {
          width: 100%;
          height: 8px;
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
          background: transparent;
        }
        
        /* Webkit 滑轨 */
        .slider-custom::-webkit-slider-runnable-track {
          width: 100%;
          height: 8px;
          background: linear-gradient(to right, 
            var(--primary) 0%, 
            var(--primary) var(--slider-progress), 
            var(--bg-tertiary) var(--slider-progress), 
            var(--bg-tertiary) 100%);
          border-radius: 4px;
        }
        
        /* Webkit 滑块 */
        .slider-custom::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid var(--primary);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 188, 212, 0.4);
          transition: all 0.2s;
          margin-top: -6px;
        }
        
        .slider-custom::-webkit-slider-thumb:hover {
          box-shadow: 0 4px 12px rgba(0, 188, 212, 0.6);
          transform: scale(1.1);
        }
        
        /* Firefox 滑轨 */
        .slider-custom::-moz-range-track {
          width: 100%;
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
        }
        
        /* Firefox 进度条 */
        .slider-custom::-moz-range-progress {
          height: 8px;
          background: var(--primary);
          border-radius: 4px;
        }
        
        /* Firefox 滑块 */
        .slider-custom::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid var(--primary);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 188, 212, 0.4);
          transition: all 0.2s;
        }
        
        .slider-custom::-moz-range-thumb:hover {
          box-shadow: 0 4px 12px rgba(0, 188, 212, 0.6);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

