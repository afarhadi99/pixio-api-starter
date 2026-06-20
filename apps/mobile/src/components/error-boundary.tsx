import React from 'react';
import { ScrollView, Text } from 'react-native';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

/**
 * Renders any caught render/runtime error on screen (instead of a blank crash)
 * so issues are diagnosable on device. Catches JS errors thrown while rendering
 * the subtree (e.g. a missing native component during render).
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#190000' }}
        contentContainerStyle={{ padding: 24, paddingTop: 72 }}
      >
        <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
          App error
        </Text>
        <Text selectable style={{ color: '#ff8a8a', fontSize: 14, fontWeight: '600' }}>
          {error.message}
        </Text>
        {error.stack ? (
          <Text selectable style={{ color: '#ffb3b3', marginTop: 16, fontSize: 11, lineHeight: 16 }}>
            {error.stack}
          </Text>
        ) : null}
      </ScrollView>
    );
  }
}
