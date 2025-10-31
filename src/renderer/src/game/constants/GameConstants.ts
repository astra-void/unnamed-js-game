import { Arrow } from '../weapons';

export const GAME_CONFIG = {
  EXP_MULTIPLIER: 5, // 다음 레벨까지 필요한 경험치 배수 (level * EXP_MULTIPLIER)
  MAX_ITEM_LEVEL: 5, // 아이템 최대 레벨
  MAX_WEAPON_LEVEL: 5, // 무기 최대 레벨

  DEFAULT_WEAPON: Arrow, // 기본 무기

  SELECTION_PANEL: {
    PANEL_WIDTH: 650, // 아이템 선택 패널 폭
    PANEL_HEIGHT: 350, // 아이템 선택 패널 높이
    CARD_WIDTH: 200, // 카드 폭
    CARD_HEIGHT: 120, // 카드 높이
    CARD_SPACING: 20, // 카드 간격
    MAX_CHOICES: 3, // 최대 선택 가능 개수
    ANIMATION_DURATION: 200 // 애니메이션 시간 (ms)
  },

  COLORS: {
    BACKGROUND_OVERLAY: 0x000000, // 배경 오버레이
    PANEL_BACKGROUND: 0x222222, // 패널 배경
    PANEL_BORDER: 0xffffff, // 패널 테두리
    CARD_BACKGROUND: 0x2b2b2b, // 카드 배경
    TEXT_PRIMARY: '#ffffff', // 기본 텍스트
    TEXT_SECONDARY: '#aaaaaa', // 보조 텍스트
    TEXT_DESCRIPTION: '#cccccc' // 설명 텍스트
  },

  ALPHA: {
    BACKGROUND_OVERLAY: 0.7, // 배경 오버레이 투명도
    PANEL: 0.95 // 패널 투명도
  },

  OFFSETS: {
    HEALTH_BAR_Y: -10, // 체력바 Y 오프셋
    ICON_MARGIN: 20, // 아이콘 여백
    TEXT_MARGIN: 10 // 텍스트 여백
  },

  PLAYER: {
    DEFAULT_SPEED: 10, // 기본 이동속도
    DEFAULT_MAX_HP: 100, // 기본 최대체력
    HEALTH_BAR_OFFSET: 40 // 체력바 오프셋
  },

  ENEMY: {
    DEFAULT_SPEED: 5, // 기본 이동속도
    DEFAULT_DAMAGE: 10, // 기본 공격력
    SPAWN_INTERVAL: 2000, // (ms)
    MIN_SPAWN_INTERVAL: 500 // (ms)
  }
} as const;
