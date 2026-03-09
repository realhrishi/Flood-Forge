import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const RainfallRadar = () => {
  const map = useMap();
  const canvasRef = useRef(null);
  const patchesRef = useRef([]);

  useEffect(() => {
    // Create Custom Canvas Overlay for Leaflet
    const CanvasLayer = L.Layer.extend({
      onAdd: function(map) {
        const canvas = L.DomUtil.create('canvas', 'leaflet-zoom-animated');
        canvas.style.pointerEvents = 'none';
        canvasRef.current = canvas;
        const size = map.getSize();
        canvas.width = size.x;
        canvas.height = size.y;
        
        map.getPanes().overlayPane.appendChild(canvas);
        
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        
        map.on('move', this._reset, this);
        map.on('resize', this._resize, this);
        
        this._reset();
        this._startAnimation();
      },
      onRemove: function(map) {
        L.DomUtil.remove(this._canvas);
        map.off('move', this._reset, this);
        map.off('resize', this._resize, this);
        if (this._animationFrame) cancelAnimationFrame(this._animationFrame);
      },
      _resize: function(e) {
        const size = e.newSize;
        this._canvas.width = size.x;
        this._canvas.height = size.y;
      },
      _reset: function() {
        const topLeft = map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
      },
      _generatePatch: function() {
        const colors = [
          'rgba(0,100,255,0.3)', // Light
          'rgba(0,220,220,0.4)', // Moderate
          'rgba(255,200,0,0.5)', // Heavy
          'rgba(255,50,50,0.6)'  // Extreme
        ];
        
        // Random starting bounds (west of India)
        const lat = 10 + Math.random() * 20;
        const lng = 65 + Math.random() * 5;
        
        patchesRef.current.push({
          lat,
          lng,
          radius: 60 + Math.random() * 40,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: 0.05 + Math.random() * 0.05, // Movement east
          vy: 0.02 + Math.random() * 0.03, // Movement north
          life: 0
        });
        
        if (patchesRef.current.length > 12) {
          patchesRef.current.shift();
        }
      },
      _startAnimation: function() {
        const render = () => {
          if (!this._ctx || !this._canvas) return;
          
          const ctx = this._ctx;
          const canvas = this._canvas;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          patchesRef.current = patchesRef.current.filter(p => p.lng < 100 && p.life < 1000);
          
          patchesRef.current.forEach(patch => {
            patch.lng += patch.vx;
            patch.lat += patch.vy;
            patch.life++;
            
            const point = map.latLngToContainerPoint([patch.lat, patch.lng]);
            const opacity = Math.max(0, 1 - (patch.life / 1000));
            
            ctx.beginPath();
            const grad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, patch.radius);
            grad.addColorStop(0, patch.color.replace(/[\d.]+\)$/g, `${opacity})`));
            grad.addColorStop(1, patch.color.replace(/[\d.]+\)$/g, '0)'));
            
            ctx.fillStyle = grad;
            ctx.arc(point.x, point.y, patch.radius, 0, Math.PI * 2);
            ctx.fill();
          });
          
          this._animationFrame = requestAnimationFrame(render);
        };
        
        render();
        this._spawner = setInterval(this._generatePatch.bind(this), 2000);
      }
    });

    const canvasLayer = new CanvasLayer();
    map.addLayer(canvasLayer);

    return () => {
      map.removeLayer(canvasLayer);
      if (canvasLayer._spawner) clearInterval(canvasLayer._spawner);
    };
  }, [map]);

  return null;
};

export default RainfallRadar;
