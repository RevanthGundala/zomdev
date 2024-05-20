/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     // Ensures that this modification is only applied server-side
  //     config.externals = [
  //       ...config.externals,
  //       // Properly specifying 'node-fetch' to be treated as a commonjs2 module
  //       ({ context, request, getResolve }, callback) => {
  //         if (request === "node-fetch") {
  //           // Return this module as a commonjs2 external
  //           return callback(null, "commonjs2 node-fetch");
  //         }
  //         // Continue without modifying any other imports
  //         return callback();
  //       },
  //     ];
  //   }

  //   // Return the modified config
  //   return config;
  // },
};

export default nextConfig;
