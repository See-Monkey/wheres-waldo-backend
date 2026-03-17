const RADIUS = 0.014;

export default function onTarget(clickX, clickY, targetX, targetY) {
	const dx = clickX - targetX;
	const dy = clickY - targetY;

	const distance = Math.sqrt(dx * dx + dy * dy);

	return distance <= RADIUS;
}
