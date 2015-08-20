<?php
Photo::preload($image);
?>

<div>
    @if (isset($image) && is_object($image))
        <img src="{{ $image->full() }}" />
    @endif
</div>
<div>
    {{ $text }}
</div>
<hr/>