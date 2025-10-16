export interface UIScale {
  fontSize: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  cardWidth: number;
  cardHeight: number;
  panelWidth: number;
  panelHeight: number;
}

export class UIConfig {
  private static baseWidth = 1920;
  private static baseHeight = 1080;

  /**
   * 화면 크기에 따른 스케일 계산
   */
  static getScale(sceneWidth: number, sceneHeight: number): UIScale {
    const scaleX = sceneWidth / this.baseWidth;
    const scaleY = sceneHeight / this.baseHeight;
    const scale = Math.min(scaleX, scaleY);

    return {
      fontSize: {
        xxs: Math.max(10, Math.round(12 * scale)),
        xs: Math.max(12, Math.round(14 * scale)),
        sm: Math.max(14, Math.round(16 * scale)),
        md: Math.max(16, Math.round(20 * scale)),
        lg: Math.max(20, Math.round(24 * scale)),
        xl: Math.max(24, Math.round(32 * scale)),
        xxl: Math.max(32, Math.round(48 * scale))
      },
      spacing: {
        xs: Math.max(4, Math.round(8 * scale)),
        sm: Math.max(8, Math.round(12 * scale)),
        md: Math.max(12, Math.round(16 * scale)),
        lg: Math.max(16, Math.round(24 * scale)),
        xl: Math.max(24, Math.round(32 * scale))
      },
      cardWidth: Math.max(150, Math.round(220 * scale)),
      cardHeight: Math.max(100, Math.round(160 * scale)),
      panelWidth: Math.max(500, Math.round(720 * scale)),
      panelHeight: Math.max(300, Math.round(400 * scale))
    };
  }

  /**
   * 텍스트 길이에 따른 폰트 크기 자동 조정
   */
  static getAdaptiveFontSize(
    text: string,
    maxWidth: number,
    baseFontSize: number,
    minFontSize: number = 12
  ): number {
    const charCount = text.length;
    const avgCharWidth = baseFontSize * 0.6;
    const estimatedWidth = charCount * avgCharWidth;

    if (estimatedWidth <= maxWidth) {
      return baseFontSize;
    }

    const scaleFactor = maxWidth / estimatedWidth;
    return Math.max(minFontSize, Math.round(baseFontSize * scaleFactor));
  }

  /**
   * 여러 줄 텍스트 스타일 계산
   */
  static getMultilineTextStyle(
    text: string,
    maxWidth: number,
    maxHeight: number,
    baseFontSize: number
  ): { fontSize: number; wordWrap: boolean; wordWrapWidth: number } {
    const words = text.split(' ');
    const avgCharWidth = baseFontSize * 0.6;
    const lineHeight = baseFontSize * 1.2;

    // 단어 길이 기반 예상 줄 수 계산
    let currentLineWidth = 0;
    let lineCount = 1;

    for (const word of words) {
      const wordWidth = word.length * avgCharWidth;
      if (currentLineWidth + wordWidth > maxWidth) {
        lineCount++;
        currentLineWidth = wordWidth;
      } else {
        currentLineWidth += wordWidth + avgCharWidth; // 공백 포함
      }
    }

    const totalHeight = lineCount * lineHeight;
    let fontSize = baseFontSize;

    // 높이가 초과하면 폰트 크기 줄이기
    if (totalHeight > maxHeight) {
      const heightScale = maxHeight / totalHeight;
      fontSize = Math.max(12, Math.round(baseFontSize * heightScale));
    }

    return {
      fontSize,
      wordWrap: true,
      wordWrapWidth: maxWidth
    };
  }

  /**
   * 컨테이너 패딩 계산
   */
  static getPadding(scale: UIScale, size: 'sm' | 'md' | 'lg'): number {
    switch (size) {
      case 'sm':
        return scale.spacing.sm;
      case 'md':
        return scale.spacing.md;
      case 'lg':
        return scale.spacing.lg;
      default:
        return scale.spacing.md;
    }
  }

  /**
   * 카드 그리드 레이아웃 계산
   */
  static calculateCardGrid(
    containerWidth: number,
    containerHeight: number,
    cardWidth: number,
    cardHeight: number,
    spacing: number,
    cardCount: number
  ): { x: number; y: number; cols: number; rows: number }[] {
    const maxCols = Math.floor(
      (containerWidth + spacing) / (cardWidth + spacing)
    );
    const cols = Math.min(maxCols, cardCount);
    const rows = Math.ceil(cardCount / cols);

    const totalGridWidth = cols * cardWidth + (cols - 1) * spacing;
    const totalGridHeight = rows * cardHeight + (rows - 1) * spacing;

    const startX = (containerWidth - totalGridWidth) / 2;
    const startY = (containerHeight - totalGridHeight) / 2;

    const positions: { x: number; y: number; cols: number; rows: number }[] =
      [];

    for (let i = 0; i < cardCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      positions.push({
        x: startX + col * (cardWidth + spacing) + cardWidth / 2,
        y: startY + row * (cardHeight + spacing) + cardHeight / 2,
        cols,
        rows
      });
    }

    return positions;
  }
}
