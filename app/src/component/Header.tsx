import React, { memo } from 'react';
import { Text, View } from 'react-native';

type Props = {
  name: string;
};

const Header = (props: Props) => (
  <View className='h-24 flex items-start justify-end bg-neutral-900 px-2'>
    <Text className='text-4xl font-bold text-white'>
      {props.name}
    </Text>
  </View>
);

export default memo(Header);
