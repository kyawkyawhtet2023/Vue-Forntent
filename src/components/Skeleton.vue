<template>
    <div
      :class="['skeleton', type]"
      :style="{ width, height, borderRadius }"
    ></div>
  </template>
  
  <script setup>
  defineProps({
    type: {
      type: String,
      default: '', // you can use types like 'text', 'circle', etc.
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '1rem',
    },
    borderRadius: {
      type: String,
      default: '4px',
    },
  });
  </script>
  
  <style scoped>
  .skeleton {
    background: linear-gradient(90deg, #979696, #f5f5f5, #eee);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite linear;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  </style>

