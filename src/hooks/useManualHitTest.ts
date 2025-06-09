import { useEffect, useRef } from 'react';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';

export function useManualHitTest(onHitTest: (hitMatrix: Float32Array) => void) {
  const { session, isPresenting } = useXR();
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const hitTestSourceRequestedRef = useRef(false);

  useEffect(() => {
    if (!isPresenting || !session) {
      hitTestSourceRef.current = null;
      hitTestSourceRequestedRef.current = false;
      return;
    }

    const requestHitTestSource = async () => {
      if (hitTestSourceRequestedRef.current) return;
      hitTestSourceRequestedRef.current = true;

      try {
        const referenceSpace = await session.requestReferenceSpace('viewer');
        const hitTestSource = await session.requestHitTestSource({ space: referenceSpace });
        hitTestSourceRef.current = hitTestSource;
      } catch (error) {
        console.warn('Hit test not supported:', error);
        hitTestSourceRequestedRef.current = false;
      }
    };

    requestHitTestSource();

    return () => {
      if (hitTestSourceRef.current) {
        hitTestSourceRef.current.cancel();
        hitTestSourceRef.current = null;
      }
      hitTestSourceRequestedRef.current = false;
    };
  }, [session, isPresenting]);

  useEffect(() => {
    if (!isPresenting || !session || !hitTestSourceRef.current) return;

    const onFrame = (time: number, frame: XRFrame) => {
      if (!hitTestSourceRef.current) return;

      try {
        const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
        
        if (hitTestResults.length > 0) {
          const hit = hitTestResults[0];
          const pose = hit.getPose(session.renderState.baseLayer?.framebuffer ? 
            session.renderState.baseLayer.framebuffer as any : 
            await session.requestReferenceSpace('local')
          );
          
          if (pose) {
            const matrix = new THREE.Matrix4();
            matrix.fromArray(pose.transform.matrix);
            onHitTest(pose.transform.matrix);
          }
        }
      } catch (error) {
        // Silently handle hit test errors
      }
    };

    session.requestAnimationFrame(onFrame);
  }, [session, isPresenting, onHitTest]);
}