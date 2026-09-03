import React, { Suspense, useEffect, useRef, useState } from "react";

const LazySection = ({ component: Component, minHeight = "400px" }) => {
  const sectionRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: shouldLoad ? "auto" : minHeight,
      }}
    >
      {shouldLoad && (
        <Suspense fallback={null}>
          <Component />
        </Suspense>
      )}
    </section>
  );
};

export default LazySection;
