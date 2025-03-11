export default function StoreHomePage() {
    const gridSize = 3; // 3x3 grid
  const imageSize = 650; // Assuming image is 600x600px

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="grid grid-cols-3 grid-rows-3 gap-8 w-[650px] h-[650px] relative overflow-hidden">
        {[...Array(gridSize * gridSize)].map((_, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;

          return (
            <div
              key={index}
              className="bg-cover bg-no-repeat rounded-xl"
              style={{
                backgroundImage: "url('https://wallpaperaccess.com/full/2090229.jpg')",
                backgroundSize: `${imageSize}px ${imageSize}px`,
                backgroundPosition: `-${col * (imageSize / gridSize)}px -${row * (imageSize / gridSize)}px`,
                width: `${imageSize / gridSize}px`,
                height: `${imageSize / gridSize}px`,
              }}
            ></div>
          );
        })}

        {/* UI Overlay */}
        <div className="absolute bottom-5 left-5 bg-black/80 text-white p-4 rounded-xl">
          <button className="bg-white text-black px-4 py-2 rounded-full">
            Generate 3D Object
          </button>
        </div>

        {/* Highlighted Text */}
        <div className="absolute bottom-5 right-5 bg-yellow-400 text-black font-bold p-4 rounded-xl">
          Maximum Customization
        </div>
      </div>
    </div>
  );
}