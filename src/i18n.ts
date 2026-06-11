import type { PocketId } from './domain/types';
import type { DisplayOptions, ExamRating, Language } from './state/defaultState';

type Translation = {
  appTitle: string;
  documentTitle: string;
  selectedPocketFallback: string;
  cutAngle: string;
  overlap: string;
  degrees: string;
  meters: string;
  teaching: string;
  formula: string;
  panelMode: string;
  teachingSteps: string[];
  currentAngle: string;
  currentCoverage: string;
  functionGraphTitle: string;
  targetPocket: string;
  helperVisibility: string;
  languageToggle: string;
  languageToggleAria: string;
  viewMode: string;
  view3d: string;
  view2d: string;
  cameraLock: string;
  cameraUnlock: string;
  cameraLockAria: string;
  cameraUnlockAria: string;
  cueBallLock: string;
  cueBallUnlock: string;
  cueBallLockAria: string;
  cueBallUnlockAria: string;
  objectBallLock: string;
  objectBallUnlock: string;
  objectBallLockAria: string;
  objectBallUnlockAria: string;
  cueProjectionTitle: string;
  cueProjectionObject: string;
  cueProjectionGhost: string;
  examTitle: string;
  enterExam: string;
  exitExam: string;
  newExamShot: string;
  confirmExam: string;
  examDifficulty: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  examTarget: string;
  examResult: string;
  userAim: string;
  theoryAim: string;
  userOverlap: string;
  theoryOverlap: string;
  difference: string;
  rating: Record<ExamRating, string>;
  pockets: Record<PocketId, string>;
  helpers: Record<keyof DisplayOptions, string>;
  warnings: Record<string, string>;
};

export const translations: Record<Language, Translation> = {
  zh: {
    appTitle: '台球瞄准',
    documentTitle: '台球瞄准模拟器',
    selectedPocketFallback: '目标袋口',
    cutAngle: '切角',
    overlap: '重合距离',
    degrees: '度',
    meters: '毫米',
    teaching: '教学',
    formula: '公式',
    panelMode: '面板模式',
    teachingSteps: [
      '1. 找到子球到目标袋口的进球线。',
      '2. 在子球后方一个球直径处放置幻想球。',
      '3. 让母球沿击球线瞄向幻想球。',
      '4. 从垂直参考直径上的投影线段读取重合比例。'
    ],
    currentAngle: '当前角度',
    currentCoverage: '当前重合',
    functionGraphTitle: '1 - sin(a)',
    targetPocket: '目标袋口',
    helperVisibility: '辅助线显示',
    languageToggle: 'English',
    languageToggleAria: '切换语言',
    viewMode: '视图模式',
    view3d: '3D',
    view2d: '2D俯视',
    cameraLock: '锁定视角',
    cameraUnlock: '解除锁定',
    cameraLockAria: '锁定视角',
    cameraUnlockAria: '解除视角锁定',
    cueBallLock: '锁定母球',
    cueBallUnlock: '解除母球锁定',
    cueBallLockAria: '锁定母球',
    cueBallUnlockAria: '解除母球锁定',
    objectBallLock: '锁定子球',
    objectBallUnlock: '解除子球锁定',
    objectBallLockAria: '锁定子球',
    objectBallUnlockAria: '解除子球锁定',
    cueProjectionTitle: '击球线投影',
    cueProjectionObject: '子球',
    cueProjectionGhost: '幻想球',
    examTitle: '考试模式',
    enterExam: '进入考试',
    exitExam: '退出考试',
    newExamShot: '换一题',
    confirmExam: '确定',
    examDifficulty: '考试难度',
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
    examTarget: '指定袋口',
    examResult: '考试结果',
    userAim: '你的瞄准',
    theoryAim: '理论瞄准',
    userOverlap: '考试重合段',
    theoryOverlap: '理论重合段',
    difference: '差异',
    rating: {
      good: 'good',
      'very-good': 'very good',
      perfect: 'perfect',
      'try-again': 'try again'
    },
    pockets: {
      'corner-nw': '左上角袋',
      'middle-n': '上中袋',
      'corner-ne': '右上角袋',
      'corner-sw': '左下角袋',
      'middle-s': '下中袋',
      'corner-se': '右下角袋'
    },
    helpers: {
      objectPath: '子球进袋线',
      cuePath: '母球击球线',
      cuePathBand: '母球路径圆柱',
      ghostBall: '幻想球',
      objectDiameter: '子球参考直径',
      overlapSegment: '重合线段',
      diameterProjection: '垂直直径投影',
      cueProjection: '击球线投影窗',
      postImpactCuePath: '撞击后母球轨迹',
      cutAngle: '角度 a'
    },
    warnings: {
      'Cue ball and object ball overlap.': '母球和子球发生重叠。',
      'Object ball is too close to the selected pocket.': '子球距离目标袋口过近。',
      'Cue ball is too close to the ghost ball.': '母球距离幻想球过近。',
      'Cut angle is over 90 degrees, so the direct pot geometry is invalid.':
        '切角超过 90 度，直接进球几何无效。'
    }
  },
  en: {
    appTitle: 'Cueball Aiming',
    documentTitle: 'Cueball Aiming Simulator',
    selectedPocketFallback: 'Target pocket',
    cutAngle: 'Cut angle',
    overlap: 'Overlap',
    degrees: 'deg',
    meters: 'mm',
    teaching: 'Teaching',
    formula: 'Formula',
    panelMode: 'Panel mode',
    teachingSteps: [
      '1. Find the object-ball path to the target pocket.',
      '2. Place the ghost ball one ball diameter behind the object ball.',
      '3. Aim the cue ball toward the ghost ball.',
      '4. Read the overlap from the projection segment on the perpendicular diameter.'
    ],
    currentAngle: 'Current angle',
    currentCoverage: 'Current coverage',
    functionGraphTitle: '1 - sin(a)',
    targetPocket: 'Target pocket',
    helperVisibility: 'Helper visibility',
    languageToggle: '中文',
    languageToggleAria: 'Switch language',
    viewMode: 'View mode',
    view3d: '3D',
    view2d: '2D top',
    cameraLock: 'Lock view',
    cameraUnlock: 'Unlock view',
    cameraLockAria: 'Lock camera view',
    cameraUnlockAria: 'Unlock camera view',
    cueBallLock: 'Lock cue ball',
    cueBallUnlock: 'Unlock cue ball',
    cueBallLockAria: 'Lock cue ball',
    cueBallUnlockAria: 'Unlock cue ball',
    objectBallLock: 'Lock object ball',
    objectBallUnlock: 'Unlock object ball',
    objectBallLockAria: 'Lock object ball',
    objectBallUnlockAria: 'Unlock object ball',
    cueProjectionTitle: 'Cue-line view',
    cueProjectionObject: 'Object',
    cueProjectionGhost: 'Ghost',
    examTitle: 'Exam mode',
    enterExam: 'Start exam',
    exitExam: 'Exit exam',
    newExamShot: 'New shot',
    confirmExam: 'Confirm',
    examDifficulty: 'Difficulty',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    examTarget: 'Target pocket',
    examResult: 'Exam result',
    userAim: 'Your aim',
    theoryAim: 'Theory',
    userOverlap: 'Exam overlap',
    theoryOverlap: 'Theory overlap',
    difference: 'Difference',
    rating: {
      good: 'good',
      'very-good': 'very good',
      perfect: 'perfect',
      'try-again': 'try again'
    },
    pockets: {
      'corner-nw': 'Northwest corner',
      'middle-n': 'North middle',
      'corner-ne': 'Northeast corner',
      'corner-sw': 'Southwest corner',
      'middle-s': 'South middle',
      'corner-se': 'Southeast corner'
    },
    helpers: {
      objectPath: 'Object path',
      cuePath: 'Cue path',
      cuePathBand: 'Cue path cylinder',
      ghostBall: 'Ghost ball',
      objectDiameter: 'Object reference diameter',
      overlapSegment: 'Overlap segment',
      diameterProjection: 'Perpendicular projection',
      cueProjection: 'Cue-line inset',
      postImpactCuePath: 'Post-impact cue path',
      cutAngle: 'Angle a'
    },
    warnings: {
      'Cue ball and object ball overlap.': 'Cue ball and object ball overlap.',
      'Object ball is too close to the selected pocket.': 'Object ball is too close to the selected pocket.',
      'Cue ball is too close to the ghost ball.': 'Cue ball is too close to the ghost ball.',
      'Cut angle is over 90 degrees, so the direct pot geometry is invalid.':
        'Cut angle is over 90 degrees, so the direct pot geometry is invalid.'
    }
  }
};
