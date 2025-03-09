module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			'react-native-reanimated/plugin',
			[
				'module-resolver',
				{
					alias: {
						'@assets': './assets',
						'@components': './src/components',
						'@navigation': './src/navigation',
						'@configs': './src/configs',
						'@screens': './src/screens',
						'@utils': './src/utils',
						'@store': './src/store',
						'@handlers': './src/handlers',
						'@services': './src/services',
						'@theme': './theme',
					},
				},
			],
		],
	};
};
